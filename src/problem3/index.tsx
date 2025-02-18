import { useMemo } from "react";
import { BoxProps } from "@mui/material";
import WalletRow from "./WalletRow";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { usePrices } from "@/hooks/usePrices";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps { }

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  // Fetch wallet balances and token prices
  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * Use a Map for blockchain priorities instead of a switch statement.
   * This provides O(1) lookups instead of multiple condition checks.
   */
  const priorityMap = useMemo(
    () =>
      new Map([
        ["Osmosis", 100],
        ["Ethereum", 50],
        ["Arbitrum", 30],
        ["Zilliqa", 20],
        ["Neo", 20],
      ]),
    [] // The map never changes, so we only define it once.
  );

  /**
   * Process balances:
   * 1. Filter out balances with priority <= -99 or zero amounts.
   * 2. Map balances to include formatted amount and USD value.
   * 3. Sort by priority in descending order.
   */
  const processedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = priorityMap.get(balance.blockchain) ?? -99;
        return priority > -99 && balance.amount > 0;
      })
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2), // Format balance amount to 2 decimal places
        usdValue: (prices[balance.currency] || 0) * balance.amount, // Calculate USD value
        priority: priorityMap.get(balance.blockchain) ?? -99, // Attach priority for sorting
      }))
      .sort((a, b) => b.priority - a.priority); // Sort balances by priority (highest first)
  }, [balances, prices, priorityMap]); // Recompute only if balances or prices change

  return (
    <div {...rest}>
      {processedBalances.map((balance) => (
        <WalletRow
          key={balance.currency} // Use `currency` as a stable key instead of `index`
          className="wallet-row"
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;

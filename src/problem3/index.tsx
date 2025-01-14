interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
// extend the WalletBalance

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  //   const { children, ...rest } = props;
  // Destruct the children and rest
  const balances = useWalletBalances();
  const prices = usePrices();

  const priorityMap = new Map<string, number>([
    ["Osmosis", 100],
    ["Ethereum", 50],
    ["Arbitrum", 30],
    ["Zilliqa", 20],
    ["Neo", 20],
  ]);

  const getPriority = (blockchain: string): number => {
    return priorityMap.get(blockchain) ?? -99; // Use -99 as the default value if the blockchain is not in the map
  };
  //getPriority function to use a Map to optimize performance, as it reduces the overhead of a switch statement by using direct key lookups.

  // - `getPriority` is called multiple times during both filtering and sorting, leading to redundant calculations.
  // - Filtering and sorting logic could be combined to optimize performance.

  const processedBalances = useMemo(() => {
    return balances
      .filter(
        (balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0 // Ensures balances with priority > -99 and non-zero amounts are retained.
      )
      .sort(
        (lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain) // Sorting based on priority (descending).
      )
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2), // Formatting balances directly.
        usdValue: prices[balance.currency] * balance.amount, // Calculating USD value here to avoid redundant operations later.
      }));
  }, [balances, prices]);

  // - `useMemo` is useful for computationally expensive operations, but here, it’s unnecessary for rendering `rows`.
  // - The mapping for rendering can directly consume `processedBalances` instead.

  return (
    <div {...rest}>
      {/*
          - Using `index` can lead to bugs if the list order changes or new items are added.
          - A unique property, like `currency`, should be used as the key. */}
      {processedBalances.map((balance) => (
        <WalletRow
          key={balance.currency} // Using `currency` as a unique key to prevent rendering issues.
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

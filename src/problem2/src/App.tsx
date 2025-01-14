import { useState, useEffect, useMemo } from "react";
import { ArrowDownUp, Loader2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchTokenData } from "./api/token-service";
import { useForm, Controller } from "react-hook-form";

interface TokenData {
  currency: string;
  price: number;
  image: string;
}

interface FormData {
  amount: string;
  fromToken: string;
  toToken: string;
}

export default function App() {
  const [tokens, setTokens] = useState<Record<string, TokenData>>({});
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: "1000.00",
      fromToken: "USDC",
      toToken: "BLUR",
    },
  });

  // Fetch token data using the provided service
  useEffect(() => {
    const fetchData = async () => {
      const tokenData = await fetchTokenData();
      const tokenMap: Record<string, TokenData> = {};
      tokenData.forEach((token) => {
        tokenMap[token.currency] = token;
      });
      setTokens(tokenMap);
    };

    fetchData();
  }, []);

  // Memoize token prices
  const selectedFromToken = useMemo(
    () =>
      tokens[control._formValues.fromToken]
        ? control._formValues.fromToken
        : "USDC",
    [tokens, control._formValues.fromToken]
  );
  const selectedToToken = useMemo(
    () =>
      tokens[control._formValues.toToken]
        ? control._formValues.toToken
        : "BLUR",
    [tokens, control._formValues.toToken]
  );

  const fromPrice = useMemo(
    () => tokens[selectedFromToken]?.price,
    [tokens, selectedFromToken]
  );
  const toPrice = useMemo(
    () => tokens[selectedToToken]?.price,
    [tokens, selectedToToken]
  );

  // Calculate conversion rate and converted amount
  useEffect(() => {
    if (fromPrice && toPrice) {
      const rate = toPrice / fromPrice;
      setConversionRate(rate);
      setConvertedAmount(parseFloat(control._formValues.amount) * rate || 0);
    }
  }, [fromPrice, toPrice, control._formValues.amount]);

  // Handle form submission
  const onSubmit = (data: FormData) => {
    // Process the data (e.g., make an API call to swap tokens)
    console.log("Swapping", data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  return (
    <Card className="w-[400px] p-4 bg-black text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Swap</h2>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Settings2 className="h-6 w-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* From Token */}
        <div className="rounded-lg bg-zinc-900 p-4">
          <div className="flex justify-between mb-2">
            <Controller
              name="fromToken"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setValue("fromToken", value)}
                >
                  <SelectTrigger className="w-[120px] bg-transparent border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(tokens).map((token) => (
                      <SelectItem key={token.currency} value={token.currency}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.image}
                            alt={token.currency}
                            className="w-6 h-6 rounded-full"
                          />
                          {token.currency}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <div className="text-gray-400 flex flex-col items-end">
              <p>Balance</p>
              <p>{fromPrice}</p>
            </div>
          </div>
          <div className="flex flex-col items-end bg-[#1f1f1f] p-2">
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Amount is required",
                validate: (value) =>
                  parseFloat(value) > 0 || "Amount must be a positive number",
              }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="number"
                    className="text-3xl bg-transparent border-0 p-0 focus-visible:ring-0 [appearance:textfield] text-right"
                  />
                  {errors.amount && (
                    <div className="text-sm text-red-500">
                      {errors.amount.message}
                    </div>
                  )}
                </>
              )}
            />
            <div className="text-right text-sm text-gray-400">
              {(
                parseFloat(control._formValues.amount) * fromPrice || 0
              ).toFixed(3)}{" "}
              USD
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className=" flex justify-center">
          <div className=" p-2 rounded-full bg-zinc-800">
            <ArrowDownUp className="h-4 w-4" />
          </div>
        </div>

        {/* To Token */}
        <div className="rounded-lg bg-zinc-900 p-4">
          <div className="flex justify-between mb-2">
            <Controller
              name="toToken"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setValue("toToken", value)}
                >
                  <SelectTrigger className="w-[120px] bg-transparent border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(tokens).map((token) => (
                      <SelectItem key={token.currency} value={token.currency}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.image}
                            alt={token.currency}
                            className="w-6 h-6 rounded-full"
                          />
                          {token.currency}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <div className="text-gray-400 flex items-end flex-col">
              <p>Balance</p>
              <p>{toPrice}</p>
            </div>
          </div>
          <div className="flex justify-end bg-[#1f1f1f] p-2 flex-col">
            <div className="text-3xl font-normal mb-1 text-right">
              {convertedAmount.toFixed(3)}
            </div>
            <div className="text-right text-sm text-gray-400">
              {(convertedAmount * toPrice || 0).toFixed(3)} USD
            </div>
          </div>
        </div>

        {/* Price Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Price</span>
            <span className="flex items-center">
              1 {control._formValues.fromToken} = {conversionRate.toFixed(6)}{" "}
              {control._formValues.toToken}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Slippage Tolerance</span>
            <span>0.5%</span>
          </div>
        </div>

        {/* Swap Button */}
        {/* Swap Button with Spinner */}
        <Button
          type="submit"
          className="w-full py-6 text-lg bg-[#d4ff67] hover:bg-[#c1eb5c] text-black"
          disabled={Object.keys(errors).length > 0 || loading}
        >
          {loading ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : "Swap"}
        </Button>

        {/* Transaction Details */}
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Minimum received</span>
            <span>
              {(convertedAmount * 0.995).toFixed(3)}{" "}
              {control._formValues.toToken}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Price impact</span>
            <span>{"<"} 0.01%</span>
          </div>
          <div className="flex justify-between">
            <span>Trading Fee</span>
            <span>0.00004 {control._formValues.toToken}</span>
          </div>
          <div className="flex justify-between">
            <span>Route</span>
            <span>
              {control._formValues.fromToken} / {control._formValues.toToken}
            </span>
          </div>
        </div>
      </form>
    </Card>
  );
}

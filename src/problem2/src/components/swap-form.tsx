import { fetchTokenData } from "@/api/token-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDownUp, Settings2 } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { SwapButton } from "./swap-button";
import { SwapDetails } from "./swap-details";
import { TokenInput } from "./token-input";
import { TokenSelector } from "./token-selector";

interface TokenData {
    currency: string;
    price: number;
    image: string;
}

export interface SwapFormData {
    amount: string;
    convertedAmount?: string;
    fromToken: string;
    toToken: string;
}


export default function SwapForm() {
    const [tokens, setTokens] = useState<Record<string, TokenData>>({});
    const [conversionRate, setConversionRate] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm<SwapFormData>({
        defaultValues: { amount: "1", fromToken: "USDC", toToken: "BLUR" },
    });

    const fromToken = watch("fromToken");
    const toToken = watch("toToken");
    const amount = watch("amount");

    const fromPrice = useMemo(() => tokens[fromToken]?.price, [tokens, fromToken]);
    const toPrice = useMemo(() => tokens[toToken]?.price, [tokens, toToken]);

    const [convertedAmount, setConvertedAmount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const tokenData = await fetchTokenData();
            const tokenMap = Object.fromEntries(tokenData.map(token => [token.currency, token]));
            setTokens(tokenMap);
        };
        fetchData();
    }, []);

    const handleConvert = useCallback(() => {
        if (!fromPrice || !toPrice || isNaN(parseFloat(amount))) return;
        const rate = fromPrice / toPrice;
        setConversionRate(rate);
        setConvertedAmount(parseFloat(amount) * rate);
    }, [fromPrice, toPrice, amount]);

    const handleSwap = useCallback(() => {
        setValue("fromToken", toToken);
        setValue("toToken", fromToken);
        setValue("amount", convertedAmount.toFixed(3)); // Swap amount and convertedAmount
    }, [fromToken, toToken, convertedAmount, setValue]);

    useEffect(() => {
        if (Object.keys(tokens).length > 0) {
            handleConvert();
        }
    }, [tokens, fromToken, toToken, amount, handleConvert]);

    const onSubmit = useCallback(() => {
        setLoading(true);
        handleConvert();
        setTimeout(() => setLoading(false), 200);
    }, [handleConvert]);

    return (
        <Card className="w-[400px] p-4 bg-black text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Swap</h2>
                <Button variant="ghost" size="icon" className="text-gray-400">
                    <Settings2 className="h-6 w-6" />
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TokenSelector formName="fromToken" control={control} setValue={setValue} tokens={tokens} />
                <TokenInput name="amount" control={control} errors={errors} fromPrice={fromPrice} setValue={setValue} />

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleSwap}
                        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
                    >
                        <ArrowDownUp className="h-6 w-6" />
                    </button>
                </div>

                <TokenSelector formName="toToken" control={control} setValue={setValue} tokens={tokens} />
                <TokenInput
                    name="convertedAmount"
                    control={control}
                    errors={errors}
                    fromPrice={toPrice}
                    setValue={setValue}
                    convertedAmount={convertedAmount}
                />

                <SwapDetails fromToken={fromToken} toToken={toToken} conversionRate={conversionRate} convertedAmount={convertedAmount} />

                <SwapButton loading={loading} disabled={Object.keys(errors).length > 0 || loading} />
            </form>
        </Card>
    );
}

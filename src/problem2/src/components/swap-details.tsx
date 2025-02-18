interface SwapDetailsProps {
    fromToken: string;
    toToken: string;
    conversionRate: number;
    convertedAmount: number;
}

export function SwapDetails({ fromToken, toToken, conversionRate, convertedAmount }: SwapDetailsProps) {
    const CONVERSION_RATE = 0.95 //95% conversion rate
    return (
        <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
                <span>Price</span>
                <span>1 {fromToken} = {conversionRate.toFixed(3)} {toToken}</span>
            </div>
            <div className="flex justify-between">
                <span>Minimum received</span>
                {/** 5% take from convert */}
                <span>{(convertedAmount * CONVERSION_RATE).toFixed(3)} {toToken}</span>
            </div>
            <div className="flex justify-between">
                <p>Conversion rate: </p>
                <span>{CONVERSION_RATE * 100}%</span>
            </div>
        </div>
    );
}

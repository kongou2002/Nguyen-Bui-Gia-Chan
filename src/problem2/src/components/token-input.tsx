import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface TokenInputProps {
    name: "amount" | "convertedAmount";
    control: any;
    errors: any;
    fromPrice?: number;
    toPrice?: number;
    setValue: (name: "amount" | "convertedAmount", value: string) => void;
    convertedAmount?: number;
}

export function TokenInput({ name, control, errors, fromPrice, setValue, convertedAmount }: TokenInputProps) {
    useEffect(() => {
        if (name === "convertedAmount" && convertedAmount !== undefined && !isNaN(convertedAmount)) {
            setValue("convertedAmount", convertedAmount.toFixed(3));
        }
    }, [name, convertedAmount, setValue]);
    return (
        <div className="rounded-lg bg-zinc-900 p-4">
            <div className="flex flex-col items-end bg-[#1f1f1f] p-2">
                {/* Token Input */}
                <Controller
                    name={name}
                    control={control}
                    rules={{
                        required: "Amount is required",
                        validate: (value) => value >= 0 || "Amount must be a positive number",
                    }}
                    render={({ field }) => (
                        <>
                            <Input
                                {...field}
                                type="number"
                                className="text-3xl bg-transparent border-0 p-0 focus-visible:ring-0 [appearance:textfield] text-right"
                                value={name === "convertedAmount" ? convertedAmount?.toFixed(3) || "" : field.value}
                                readOnly={name === "convertedAmount"} // Make read-only for converted amount
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setValue(name, value);
                                }}
                            />
                            {errors[name] && <div className="text-sm text-red-500">{errors[name].message}</div>}
                        </>
                    )}
                />

                {/* USD Equivalent */}
                {name === "amount" && (
                    <div className="text-right text-sm text-gray-400">
                        ≈ {(parseFloat(control._formValues.amount || "0") * (fromPrice || 0)).toFixed(3)} USD
                    </div>
                )}
            </div>
        </div>
    );
}

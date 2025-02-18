import axios from "axios";

type TokenData = {
  price: number;
  currency: string;
};

type TokenResponse = {
  [symbol: string]: TokenData;
};

export const fetchTokenData = async () => {
  const response = await axios.get<TokenResponse>(
    "https://interview.switcheo.com/prices.json"
  );
  return Object.entries(response.data)
    .map(([, data]) => ({
      currency: data.currency,
      price: data.price,
      image: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${data.currency}.svg`,
    }))
    .filter((token) => token.price);
};

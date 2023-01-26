import axios from "axios";

export const checkPair = async (pair: string) => {

    const pairs = await axios.get(
        `${process.env.BITFINEX_API}conf/pub:list:pair:exchange`
      );
    
      let checkPair = null;
      if (pairs.data && pairs.data[0])
        checkPair = pairs.data[0].find((e: string) => e === pair);
    
      if (checkPair == null || typeof checkPair === undefined) {
        throw new Error(`The pair ${pair} has not been found.`);
      }
      
};

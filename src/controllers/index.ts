import { Request, Response } from "express";
import ws from "ws";
import axios from "axios";
import { Server } from "socket.io";
import { AvgPriceI } from "../interfaces/avg-price";
import { OrderBook } from "../interfaces/order-book";
import { checkPair } from "../helpers/check-pairs";

const io = new Server();

export const getTips = async (req: Request, res: Response) => {
  const payload = req.query;

  checkPair(payload.pair.toString());

  const { bid, ask } = await getBooks(payload.pair.toString());

  res.json({
    status: 200,
    data: {
      tips: {
        bid: bid,
        ask: ask,
      },
    },
  });

  emitOwnSocket();
};

const emitOwnSocket = async () => {
  const w = new ws("wss://api-pub.bitfinex.com/ws/2");

  w.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    // limpio todo lo que por ahora no uso
    if (data.event) return;
    if (data[1] === "hb") return;

    const orderBook: OrderBook[] = [];
    if (data[1].length === 3) {
      orderBook.push({
        price: data[1][0],
        amount: data[1][2],
      });
    }

    // genero mi propio canal de websocket en el que emito el orderbook
    io.emit("orderBook", orderBook);
  });

  let msg = JSON.stringify({
    event: "subscribe",
    channel: "book",
    symbol: `tETHUSD`,
  });
  w.on("open", () => w.send(msg));
};

const getBooks = async (
  pair: string
): Promise<{ bid: OrderBook[]; ask: OrderBook[] }> => {
  const book = await axios.get(`${process.env.BITFINEX_API}book/t${pair}/P0`);

  const bid: OrderBook[] = [];
  const ask: OrderBook[] = [];

  // Last 25 txs order book, we save it in case we need it later
  book.data.forEach((e: any[]) => {
    if (e[2] > 0) {
      bid.push({
        price: e[0],
        amount: e[2],
      });
    } else {
      ask.push({
        price: e[0],
        amount: e[2],
      });
    }
  });

  return {
    bid,
    ask,
  };
};

export const avgPrice = async (req: Request, res: Response) => {
  const payload: AvgPriceI = req.body;

  checkPair(payload.pair.toString());

  let { bid, ask } = await getBooks(payload.pair.toString());

  // Obtengo el precio del par
  const trade = await axios.post(
    `${process.env.BITFINEX_API}calc/trade/avg?symbol=t${payload.pair}&amount=${payload.amount}`
  );

  let priceWithMarketDepth = 0;
  let currentAmount = payload.amount;
  

  // segmento entre buy y sell
  if (payload.type == "buy" && bid) {
    let index = 0;

    // genero una condicion de cierre del while,
    // ademas se le agrega el limite que el usuario quiere gasta.
    // Le faltaria la implementacion entre la linea 112 y 115 con un condicional
    // que calcule el precio final de este bid en particular para revisar si se pasa o no del limite
    while (currentAmount > 0 && priceWithMarketDepth < payload.limit) {
      if (bid[index].amount < currentAmount) {
        currentAmount -= bid[index].amount;

        priceWithMarketDepth += bid[index].amount * bid[index].price;
      } else {
        priceWithMarketDepth += currentAmount * bid[index].price;
        currentAmount = 0;
      }
      index++;
    }
  } else if (payload.type == "sell"  && ask) {
    let index = 0;
    while (currentAmount > 0 && priceWithMarketDepth < payload.limit) {
      if (Math.abs(ask[index].amount) < currentAmount) {
        currentAmount -= Math.abs(ask[index].amount);

        priceWithMarketDepth += Math.abs(ask[index].amount) * ask[index].price;
      } else {
        priceWithMarketDepth += currentAmount * ask[index].price;
        currentAmount = 0;
      }
      index++;
    }
  } else {
    throw new Error(`Wrong type`);
  }

  res.json({
    status: 200,
    data: {
      pair: payload.pair,
      type: payload.type,
      pairPrice: trade.data[0],
      amount: payload.amount - currentAmount,
      total: priceWithMarketDepth,
    },
  });
};
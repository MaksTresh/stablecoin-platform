import time

from typing import Callable
from binance import ThreadedWebsocketManager


class BinanceStream:
    def __init__(self, ticker: str, callback: Callable) -> None:
        self.twm = ThreadedWebsocketManager()
        self.twm.start()
        self.twm.start_depth_socket(callback=callback,
                                    symbol=self.parsed_ticker(ticker),
                                    interval=100)

    @staticmethod
    def parsed_ticker(unparsed_ticker: str) -> str:
        return unparsed_ticker.replace('/', '').upper()


class PriceListener:
    def __init__(self, ticker):
        self.ticker = ticker
        self.last_price = None

    def update_price_callback(self, data: dict):
        try:
            b = data['b'][:1]
            a = data['a'][:1]
            if a and b:
                if a[0] and b[0]:
                    a = float(a[0][0])
                    b = float(b[0][0])
                    self.last_price = (b + a) / 2
                    return

            if a:
                if a[0]:
                    a = float(a[0][0])
                    self.last_price = a
                    return

            if b:
                if b[0]:
                    b = float(b[0][0])
                    self.last_price = b
                    return

        except Exception as e:
            print(e)

    def run(self):
        BinanceStream(ticker=self.ticker, callback=self.update_price_callback)


class IndexPriceCollector:
    def __init__(self, tickers):

        self.last_price: dict = {}
        for ticker in tickers:
            self.last_price[ticker] = None

        self.price_listeners = []

    def get_index_price(self):
        last_prices = []
        for price_listener in self.price_listeners:
            last_prices.append(price_listener.last_price)
        if all(last_prices):
            return (sum(last_prices)/len(last_prices)) * 62

    def run(self):
        for ticker in self.last_price.keys():
            price_listener = PriceListener(ticker)
            self.price_listeners.append(price_listener)
            price_listener.run()


ipc = IndexPriceCollector(['PAXG/USDT'])
ipc.run()
while True:
    time.sleep(0.5)
    ip = ipc.get_index_price()
    print(ip)

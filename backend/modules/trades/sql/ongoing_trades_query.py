import importlib.resources

with importlib.resources.open_text("modules.trades.sql", "ongoing_trades_query.sql") as f:
    ongoing_trades_query = f.read()

# fxtrading

# install instructions
cd fxtrading

npm install

npm run dev


# key notes
Used local storage as database, hard-coded few parent orders, child orders and positions to show up initially.

Used material UI completely.

Parent order will be marked as Rejected if the price is more than +/- 5% of base price and user can cancel it after that, we can filter out Rejected orders also if required.

Cancelling the order will remove the entry from Parent Orders, allowing the user to cancel the order only if Status is Open or Rejected.

Child order can only be executed at current price, forcing the user to execute at current price and marked as complete by default.

Showing net profit/loss as the average price in positions if the net quantity is zero (sell and buy quantity is same).

Considering only the Traded Quantity for compution Spread Cost in parent orders and positions.

Execute Order is shown only if the Traded Quantity is less than Quantity of parent order.

Clicking on Child Orders tab will show all child orders and accessing it from Parent Orders tabel will show the child orders of that parent order.

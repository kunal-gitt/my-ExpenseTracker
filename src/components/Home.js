import { useRef, useState } from "react";
import classes from "./Home.module.css";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [expenses, setExpenses] = useState([]);

  const priceInputRef = useRef();
  const descInputRef = useRef();
  const categoryInputRef = useRef();

  const dailyexpensehandler = (e) => {
    e.preventDefault();

    const enteredprice = priceInputRef.current.value;
    const entereddesc = descInputRef.current.value;
    const enteredcategory = categoryInputRef.current.value;

    const newExpense = {
      id: Math.random().toString(),
      price: enteredprice,
      description: entereddesc,
      category: enteredcategory,
    };

    setExpenses((prevExpenses) => {
      return [...prevExpenses, newExpense];
    });
    priceInputRef.current.value = "";
    descInputRef.current.value = "";
    categoryInputRef.current.value = "";
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.fitem}>Welcome to Expense Tracker</div>
        <div className={classes.item}>
          you profile is incomplete <NavLink to="/update">Complete now</NavLink>
        </div>
      </div>

      <form onSubmit={dailyexpensehandler}>
        <label>price</label>
        <input type="number" ref={priceInputRef} />
        <label>Description</label>
        <input type="text" ref={descInputRef} />
        <label htmlFor="expense">Category</label>
        <select name="expenses" id="expense" ref={categoryInputRef}>
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
        </select>
        <button>Add expense</button>
      </form>

      <ul>
        {expenses.map((expense) => (
          <li
            key={expense.id}
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div>{expense.price}</div>
            <div>{expense.description}</div>
            <div>{expense.category}</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

import { useEffect, useRef, useState } from "react";
import classes from "./Home.module.css";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [expenses, setExpenses] = useState([]);

  const priceInputRef = useRef();
  const descInputRef = useRef();
  const categoryInputRef = useRef();
  useEffect(() => {
    async function fetchdata() {
      try {
        const response = await fetch(
          "https://expensetracker-f73e3-default-rtdb.firebaseio.com/expenses.json",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);

        const loadedexpenses = [];

        for (const key in data) {
          loadedexpenses.push({
            id: key,
            price: data[key].Price,
            description: data[key].Desc,
            category: data[key].Category,
          });
        }

        setExpenses(loadedexpenses);
      } catch (err) {
        console.log(err);
      }
    }
    fetchdata();
  }, []);

  const dailyexpensehandler = async (e) => {
    e.preventDefault();

    const enteredprice = priceInputRef.current.value;
    const entereddesc = descInputRef.current.value;
    const enteredcategory = categoryInputRef.current.value;

    try {
      const response = await fetch(
        "https://expensetracker-f73e3-default-rtdb.firebaseio.com/expenses.json",
        {
          method: "POST",
          body: JSON.stringify({
            Price: enteredprice,
            Desc: entereddesc,
            Category: enteredcategory,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }

    const newexpense = {
      id: Math.random(),
      price: enteredprice,
      description: entereddesc,
      category: enteredcategory,
    };

    setExpenses((prev) => {
      return [...prev, newexpense];
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
        <select name="expense" id="expense" ref={categoryInputRef}>
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

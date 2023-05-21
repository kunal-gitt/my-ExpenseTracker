import { useEffect, useRef, useState } from "react";
import classes from "./Home.module.css";
import { NavLink, useNavigate } from "react-router-dom";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const [SwitchAddEdit, setSwitchAddEdit] = useState(true);

  const [id, setid] = useState("");

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

      const newexpense = {
        id: data.name,
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
    } catch (err) {
      console.log(err);
    }
  };

  const editbtnhandler = async (expense) => {
    priceInputRef.current.value = expense.price;
    descInputRef.current.value = expense.description;
    categoryInputRef.current.value = expense.category;

    setid(expense.id);
    setSwitchAddEdit(false);
  };

  const deletebtnhandler = async (id) => {
    try {
      const response = await fetch(
        `https://expensetracker-f73e3-default-rtdb.firebaseio.com/expenses/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      const data = await response.json();
      setExpenses((prev) => {
        return prev.filter((expense) => {
          if (expense.id !== id) {
            return true;
          }
        });
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const editdatainserver = async (e) => {
    e.preventDefault();
    const enteredprice = priceInputRef.current.value;
    const entereddesc = descInputRef.current.value;
    const enteredcategory = categoryInputRef.current.value;

    try {
      const response = await fetch(
        `https://expensetracker-f73e3-default-rtdb.firebaseio.com/expenses/${id}.json`,
        {
          method: "PUT",
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

      const newexpense = {
        id: data.name,
        price: enteredprice,
        description: entereddesc,
        category: enteredcategory,
      };

      setExpenses((prev) => {
        return prev.filter((value) => {
          if (value.id !== id) {
            return true;
          }
        });
      });
      setExpenses((prev) => {
        return [...prev, newexpense];
      });
      priceInputRef.current.value = "";
      descInputRef.current.value = "";
      categoryInputRef.current.value = "";
      setid("");
      setSwitchAddEdit(true);
    } catch (err) {
      console.log(err);
    }
  };

  const logouthandler = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <>
      <button className="btn" onClick={logouthandler}>
        Logout
      </button>
      <div className={classes.container}>
        <div className={classes.fitem}>Welcome to Expense Tracker</div>
        <div className={classes.item}>
          you profile is incomplete <NavLink to="/update">Complete now</NavLink>
        </div>
      </div>

      <form onSubmit={SwitchAddEdit ? dailyexpensehandler : editdatainserver}>
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
        <button>{!SwitchAddEdit ? "Edit expense" : "Add expense"}</button>
      </form>

      <ul>
        {expenses.map((expense) => (
          <li
            key={Math.random()}
            style={{
              display: "flex",
            }}
          >
            <div>{expense.price}</div>
            <div>{expense.description}</div>
            <div>{expense.category}</div>
            <button onClick={() => editbtnhandler(expense)}>Edit</button>
            <button onClick={() => deletebtnhandler(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

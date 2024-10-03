import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getTodoList = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user); // Set the user in state

      // Get user role from user_roles table
      const { data: userRoleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single(); // Ensure it returns only one row

      if (roleError) {
        console.error("Error fetching user role:", roleError.message);
        return;
      }

      const role = userRoleData.role;

      // Fetch todos based on role
      const { data: todos, error } =
        role === "admin"
          ? await supabase.from("todos").select("*") // Admin can see all todos
          : await supabase.from("todos").select("*").eq("user_id", user.id); // Normal user can only see their todos

      if (error) {
        console.error("Error fetching todos:", error.message);
      } else {
        setTodos(todos || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  const addTodo = async () => {
    if (!newTodo) {
      alert("Please add a todo");
      return;
    }

    const { error } = await supabase
      .from("todos")
      .insert([{ task: newTodo, user_id: user.id }]);

    if (error) {
      console.error("Error adding todo:", error.message);
    } else {
      getTodoList();
      setNewTodo("");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-center items-center gap-[40px]">
      {user && (
        <h1 className="text-center text-[30px] font-bold">
          Hello {user.email}
        </h1>
      )}
      <div className="flex gap-[100px] p-[20px]">
        <div className="flex flex-col gap-[20px] flex-[25%_0_0]">
          <h2>Add your todo here:</h2>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="h-[50px] p-2 rounded-md"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-green-600 rounded-xl"
          >
            Add Todo
          </button>
          <button onClick={signOut} className="bg-red-700 rounded-xl ">
            Sign Out
          </button>
        </div>
        <div className="">
          <ol className="list-decimal">
            {todos.length === 0 ? (
              <p>No todos available</p>
            ) : (
              <div>
                <h2 className="text-gray-400">Your Todo List</h2>
                {todos.map((todo, index) => (
                  <li key={index}>{todo.task}</li>
                ))}
              </div>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

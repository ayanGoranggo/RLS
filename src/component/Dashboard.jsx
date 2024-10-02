import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getTodoList = async () => {
    // Fetch the currently authenticated user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Error fetching user:", authError.message);
      setLoading(false);
      return;
    }

    if (!userData || !userData.user) {
      console.error("No user is currently logged in.");
      setLoading(false);
      return;
    }

    const loggedInUser = userData.user;
    setUser(loggedInUser);

    // Fetch user role
    const { data: userRoleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", loggedInUser.id)
      .single();

    if (roleError) {
      console.error("Error fetching user role:", roleError.message);
      setTodos([]);
      setLoading(false);
      return;
    }

    const userRole = userRoleData?.role;

    let todosData = null;
    let todosError = null;

    // Fetch todos based on user role
    if (userRole === "admin") {
      // Admin can see all todos
      ({ data: todosData, error: todosError } = await supabase
        .from("todos")
        .select("*"));
    } else {
      // Normal users can see only their own todos
      ({ data: todosData, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", loggedInUser.id));
    }

    if (todosError) {
      console.error("Error fetching todos:", todosError.message);
      setTodos([]);
    } else {
      setTodos(todosData || []);
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
      <h1 className="text-center text-[30px] font-bold">Hello {user?.email}</h1>
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

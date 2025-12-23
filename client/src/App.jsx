import React, { useState, useEffect } from 'react';

function App() {
  const [foodList, setFoodList] = useState([]);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Stores ID, Name, Role

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Vendor Form States
  const [newItem, setNewItem] = useState({
    name: "", description: "", originalPrice: "", discountedPrice: "", quantity: "", category: "Bakery", expiryTime: ""
  });

  const fetchFood = () => {
    fetch('http://localhost:5000/api/food/all')
      .then(res => res.json())
      .then(data => setFoodList(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (token) fetchFood();
  }, [token]);

  // --- ACTIONS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setUser(data.user); // Now contains _id and role!
        alert(`✅ Welcome ${data.user.name} (${data.user.role})`);
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
  console.log(error); // <--- Now we are using it!
  alert("Something went wrong!");
}
  };

  const handleBuy = async (foodId) => {
    try {
      const response = await fetch('http://localhost:5000/api/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, foodId, quantity: 1 })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`✅ Order Success! Code: ${data.pickupCode}`);
        fetchFood();
      } else { alert("❌ " + data.message); }
    } catch (error) {
  console.log(error); // <--- Now we are using it!
  alert("Something went wrong!");
}
  };

  const handlePostFood = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/food/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: user._id, // Uses the logged-in user's ID
          ...newItem
        })
      });
      if (response.ok) {
        alert("✅ Food Posted Successfully!");
        setNewItem({ name: "", description: "", originalPrice: "", discountedPrice: "", quantity: "", category: "Bakery", expiryTime: "" }); // Clear form
        fetchFood(); // Refresh grid
      } else {
        alert("Failed to post food");
      }
    } catch (error) {
  console.log(error); // <--- Now we are using it!
  alert("Something went wrong!");
}
  };

  // --- RENDER ---

  if (!token) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f8" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "350px" }}>
          <h2 style={{ textAlign: "center", color: "#ff5722" }}>🍪 FoodRescue Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ccc" }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ccc" }} />
            <button type="submit" style={{ width: "100%", padding: "12px", background: "#ff5722", color: "white", border: "none", cursor: "pointer" }}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">🍪 FoodRescue</div>
        <div className="nav-links">
          <span>{user.name} ({user.role})</span>
          <span onClick={() => { setToken(null); setUser(null); }}>Logout</span>
        </div>
      </nav>

      <div className="container">
        {/* VENDOR DASHBOARD: Only show if role is 'vendor' */}
        {user.role === 'vendor' && (
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px", borderLeft: "5px solid #ff5722", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <h2 style={{ marginBottom: "15px", color: "#d84315" }}>📤 Post New Food</h2>
            <form onSubmit={handlePostFood} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required style={{ padding: "10px" }} />
              <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} style={{ padding: "10px" }} />
              <input type="number" placeholder="Original Price" value={newItem.originalPrice} onChange={e => setNewItem({...newItem, originalPrice: e.target.value})} required style={{ padding: "10px" }} />
              <input type="number" placeholder="Discount Price" value={newItem.discountedPrice} onChange={e => setNewItem({...newItem, discountedPrice: e.target.value})} required style={{ padding: "10px" }} />
              <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required style={{ padding: "10px" }} />
              <input type="date" value={newItem.expiryTime} onChange={e => setNewItem({...newItem, expiryTime: e.target.value})} required style={{ padding: "10px" }} />
              <button type="submit" style={{ gridColumn: "span 2", padding: "12px", background: "#27ae60", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>UPLOAD ITEM</button>
            </form>
          </div>
        )}

        <div className="hero-text">
          <h1>{user.role === 'vendor' ? 'Your Active Items' : 'Fresh Deals Nearby'}</h1>
        </div>

        <div className="food-grid">
          {foodList.map((food) => (
            <div key={food._id} className="food-card">
              <div className="food-header">{food.category === 'Bakery' ? '🥐' : '🥗'}</div>
              <div className="food-body">
                <h3 className="food-title">{food.name}</h3>
                <p className="description">{food.description}</p>
                <div className="price-box">
                  <span className="original-price">₹{food.originalPrice}</span>
                  <span className="discount-price">₹{food.discountedPrice}</span>
                </div>
                <div className="stock-badge">⚡ {food.quantity} left</div>
              </div>
              
              {/* VENDOR SEES 'EDIT' (Fake button for now), STUDENT SEES 'BUY' */}
              <div className="card-footer">
                {user.role === 'student' ? (
                   food.quantity > 0 ? 
                   <button className="btn-buy" onClick={() => handleBuy(food._id)}>GRAB DEAL</button> : 
                   <button className="btn-disabled" disabled>SOLD OUT</button>
                ) : (
                  <button className="btn-disabled" style={{background: "#2c3e50", color: "white", cursor: "default"}}>You are the Seller</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
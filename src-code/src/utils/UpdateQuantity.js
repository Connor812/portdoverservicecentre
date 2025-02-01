export function UpdateQuantity(cartItems, setCartItems, action, item) {
    const updatedCartItems = cartItems.map(cartItem => {
        if (cartItem.id === item.id) {
            let newQuantity = cartItem.quantity;
            if (action === "increase") {
                newQuantity += 1;
            } else if (action === "subtract" && cartItem.quantity > 1) {
                newQuantity -= 1;
            }
            return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
    });

    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
}
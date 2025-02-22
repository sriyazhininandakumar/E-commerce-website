describe("Customer Cart Page UI Tests", () => {
    beforeEach(() => {
      cy.window().then((win) => {
        // Mock user ID
        win.localStorage.setItem("userId", "1");
        
        // Mock cart data
        win.sessionStorage.setItem(
          "cart",
          JSON.stringify([{ id: 1, name: "Product A", price: 100, quantity: 1 }])
        );
      });
  
      // Visit the cart page AFTER setting sessionStorage
      cy.visit("http://localhost:5173/customer/cart");
  
      // Wait for the page to load
      cy.wait(500);
    });
  
    it("should load the Cart page successfully", () => {
      cy.get("h2").should("have.text", "Cart").and("be.visible");
    });
  
    it("should display cart items", () => {
      cy.contains("Product A").should("be.visible");
      cy.contains("Rs 100 x 1").should("be.visible");
    });
  
    it("should allow increasing item quantity", () => {
      cy.get('button:contains("+")').click();
      cy.wait(500);
      cy.contains("Rs 100 x 2").should("be.visible");
    });
  
    it("should allow decreasing item quantity", () => {
      cy.get('button:contains("-")').click();
      cy.wait(500);
      cy.contains("Rs 100 x 1").should("be.visible");
    });
  
    it("should remove an item from the cart", () => {
      cy.get('button:contains("Remove")').click();
      cy.wait(500);
      cy.contains("Your cart is empty.").should("be.visible");
    });
  
    it("should show an error if trying to place an order with an empty cart", () => {
      cy.get('button:contains("Place Order")').click();
      cy.contains("Your cart is empty!").should("be.visible");
    });
  
    it("should place an order successfully", () => {
      // Mock successful API response
      cy.intercept("POST", "http://localhost:3000/api/orders/place-order", {
        statusCode: 200,
        body: { orderId: 123 },
      });
  
      cy.get('button:contains("Place Order")').click();
      cy.contains("Order placed successfully! Order ID: 123").should("be.visible");
    });
  });
  
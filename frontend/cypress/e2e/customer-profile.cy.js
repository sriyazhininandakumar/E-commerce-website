describe("Customer Profile", () => {
    beforeEach(() => {

      cy.request("POST", "http://localhost:3000/api/auth/signin", {
        email: "adhithis@gmail.com", 
        password: "123", 
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        cy.window().then((win) => {
            win.localStorage.setItem("token", response.body.accessToken);
            win.localStorage.setItem(
              "customer",
              JSON.stringify({ name: "adhithis", role: "customer" }) 
            );
          });
  
        cy.visit("http://localhost:5173/customer/profile");
      });
    });
  
    it("should display the customer profile", () => {
      cy.contains("Hi, adhithis!").should("be.visible");
      cy.contains("Role: customer").should("be.visible");
    });
  
    it("should fetch and display customer orders", () => {
      cy.intercept("GET", "http://localhost:3000/api/customer/orders", {
        statusCode: 200,
        body: {
          orders: [
            {
              orderId: 1,
              products: [
                { productName: "Product A", quantity: 2, status: "Pending" },
                { productName: "Product B", quantity: 1, status: "Delivered" },
              ],
            },
          ],
        },
      }).as("fetchOrders");
  
      cy.reload(); 
  
      cy.wait("@fetchOrders");
  
      cy.contains("Your Orders").should("be.visible");
      cy.contains("Product A").should("be.visible");
      cy.contains("Product B").should("be.visible");
      cy.contains("Pending").should("be.visible").and("have.class", "text-yellow-500");
      cy.contains("Delivered").should("be.visible").and("have.class", "text-green-500");
    });
  
    it("should allow customer to sign out", () => {
      cy.contains("Sign Out").click();
  
      
      cy.window().then((win) => {
        expect(win.localStorage.getItem("customer")).to.be.null;
        expect(win.localStorage.getItem("token")).to.be.null;
      });
  
      
      cy.url().should("eq", "http://localhost:5173/");
    });
  });
  
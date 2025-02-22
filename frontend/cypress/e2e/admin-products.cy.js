describe("Admin Dashboard", () => {
    beforeEach(() => {
      cy.request("POST", "http://localhost:3000/api/auth/signin", {
        email: "suresh@gmail.com", // Replace with a valid admin email
        password: "123",  // Replace with a valid password
      }).then((response) => {
        expect(response.status).to.eq(200);
  
        cy.window().then((win) => {
          win.localStorage.setItem("token", response.body.accessToken);
        });
  
        cy.visit("http://localhost:5173/admin/products", { timeout: 10000 });
      });
    });
  
    it("should display the admin dashboard", () => {
      cy.contains("Admin Dashboard").should("be.visible");
    });
  
    it("should allow adding a product", () => {
      cy.get('input[placeholder="Name"]').type("Test Product");
      cy.get('input[placeholder="Description"]').type("This is a test product.");
      cy.get('input[placeholder="Price"]').type("200");
      cy.get('input[placeholder="Image URL"]').type("https://via.placeholder.com/150");
      cy.contains("Add Product").click();
  
      
    });
  
    it("should allow editing a product", () => {
  
      cy.get('input[placeholder="Name"]').clear().type("Updated Product");
      cy.contains("Update Product").click();
  
      cy.contains("Updated Product").should("be.visible");
    });
  
    it("should allow deleting a product", () => {
      cy.contains("Updated Product").parent().find("button").contains("Delete").click();
  
      cy.contains("Updated Product").should("not.exist");
    });
  
    it("should allow assigning a manufacturer", () => {
      cy.get('input[placeholder="4"]').type("1"); // Replace with a valid ID
      cy.get('input[placeholder="2"]').type("1"); // Replace with a valid ID
      cy.contains("Assign").click();// Adjust based on API response
    });
  });
  
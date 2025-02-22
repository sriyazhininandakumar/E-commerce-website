<reference types="cypress" />

describe("Admin Home Page", () => {
    const adminData = { name: "suresh", role: "Admin" };
  
    beforeEach(() => {
        cy.log("Visiting Admin Dashboard...");

      cy.visit("http://localhost:5173/admin/home");
    });
  
    it("should show welcome message when admin is stored in localStorage", () => {
      cy.window().then((win) => {
        win.localStorage.setItem("admin", JSON.stringify(adminData));
      });
  
      cy.reload(); 
  
      cy.contains("Welcome, suresh!").should("be.visible");
    });
  
    it("should display default message when admin is not in localStorage", () => {
      cy.window().then((win) => {
        win.localStorage.removeItem("admin"); 
      });
  
      cy.reload();
  
    });
  });
  
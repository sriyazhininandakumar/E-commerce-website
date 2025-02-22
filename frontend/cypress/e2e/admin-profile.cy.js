describe("Admin Profile Page", () => {
    beforeEach(() => {
      const adminData = {
        name: "Suresh",
        role: "Administrator",
      };
      localStorage.setItem("admin", JSON.stringify(adminData));
      localStorage.setItem("token", "dummy_admin_token");
  
      cy.visit("http://localhost:5173/admin/profile");
    });
  
    it("should display the admin's name and role", () => {
      cy.contains("Name : Suresh").should("be.visible");
      cy.contains("Role : Administrator").should("be.visible");
    });
  
    it("should sign out the admin and clear localStorage", () => {
      cy.contains("Sign Out").click();
  
      
      cy.window().then((win) => {
        expect(win.localStorage.getItem("admin")).to.be.null;
        expect(win.localStorage.getItem("token")).to.be.null;
      });
  
     
      cy.url().should("eq", "http://localhost:5173/");
    });
  });
  
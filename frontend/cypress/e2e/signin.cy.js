describe("Sign In Page UI Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/"); // Visit the sign-in page
  });

  it("should load the Sign In page", () => {
    cy.get("h2").should("have.text", "Sign In").and("be.visible");
  });

  it("should allow entering email and password", () => {
    cy.get('input[name="email"]').type("test@example.com").should("have.value", "test@example.com");
    cy.get('input[name="password"]').type("password123").should("have.value", "password123");
  });

  it("should show an error for invalid credentials", () => {
    cy.intercept("POST", "http://localhost:3000/api/auth/signin", {
      statusCode: 401,
      body: { message: "Invalid credentials!" },
    }).as("signinRequest");

    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get("button").contains("Sign In").click();

    cy.wait("@signinRequest");
    cy.contains("Invalid credentials!").should("be.visible");
  });

  it("should sign in successfully and redirect based on role", () => {
    const userData = {
      accessToken: "testToken",
      role: "Customer",
      id: 1,
      name: "John Doe",
    };

    cy.intercept("POST", "http://localhost:3000/api/auth/signin", {
      statusCode: 200,
      body: userData,
    }).as("signinRequest");

    cy.get('input[name="email"]').type("customer@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign In").click();

    cy.wait("@signinRequest");

    // Check if localStorage is set correctly
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.equal(userData.accessToken);
      expect(win.localStorage.getItem("role")).to.equal(userData.role);
      expect(win.localStorage.getItem("userId")).to.equal(userData.id.toString());
    });

    // Ensure redirection to the customer page
    cy.url().should("include", "/customer");
  });

  it("should allow navigating to Sign Up page", () => {
    cy.contains("Sign Up").click();
    cy.url().should("include", "/signup");
  });
});

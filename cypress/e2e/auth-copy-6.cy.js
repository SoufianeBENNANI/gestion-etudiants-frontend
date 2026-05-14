describe("Test Auth Keycloak", () => {

  it("Login et accès ADMIN", () => {

    // 🔥 ouvrir ton app
    cy.visit("http://localhost:5173");

    // 🔐 attendre redirection vers Keycloak
    cy.origin("http://localhost:8081", () => {

      // 🔥 attendre que le formulaire existe
      cy.get("#username", { timeout: 10000 }).should("be.visible");

      cy.get("#username").type("soufiane");
      cy.get("#password").type("123456");

      // 🔥 important : attendre bouton
      cy.get("#kc-login").should("be.visible").click();

    });

    // 🔥 attendre retour React
    cy.url({ timeout: 10000 }).should("include", "localhost:5173");

    // 🔥 attendre chargement roles
    cy.contains("Dashboard", { timeout: 10000 });

    // ✅ vérifier admin
    cy.url().should("include", "/admin");

  });

});
const KEYCLOAK_URL = "http://localhost:8081";
const FRONTEND_URL = "http://localhost:5173";

const users = [
  {
    label: "ADMIN",
    username: "soufiane",
    password: "123456",
    expectedUrl: "/admin",
    expectedText: "Dashboard",
  },
  {
    label: "MANAGER",
    username: "youness",
    password: "123456789",
    expectedUrl: "/manager",
    expectedText: "Dashboard",
  },
  {
    label: "TEACHER",
    username: "ilham",
    password: "987654",
    expectedUrl: "/teacher",
    expectedText: "Dashboard",
  },
  {
    label: "STUDENT",
    username: "lina",
    password: "012345",
    expectedUrl: "/student",
    expectedText: "Dashboard",
  },
];

describe("Authentification Keycloak par rôle", () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
  });

  users.forEach((user) => {
    it(`${user.label} doit accéder à ${user.expectedUrl}`, () => {
      cy.visit(FRONTEND_URL);

      cy.origin(
        KEYCLOAK_URL,
        {
          args: {
            username: user.username,
            password: user.password,
          },
        },
        ({ username, password }) => {
          cy.get("#username", { timeout: 10000 }).should("be.visible").clear();
          cy.get("#username").type(username);

          cy.get("#password", { timeout: 10000 }).should("be.visible").clear();
          cy.get("#password").type(password);

          cy.get("#kc-login", { timeout: 10000 }).should("be.visible").click();
        }
      );

      cy.url({ timeout: 15000 }).should("include", FRONTEND_URL);
      cy.url({ timeout: 15000 }).should("include", user.expectedUrl);

      cy.contains(user.expectedText, { timeout: 15000 }).should("exist");
    });
  });
});
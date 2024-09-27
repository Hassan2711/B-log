const swaggerJsDoc = {
  openapi: "3.0.0",
  info: {
    title: "Blog API",
    version: "1.0.0",
    description: "API documentation for user authentication and blog posts",
  },
  servers: [
    {
      url: "http://localhost:3001",
    },
  ],
  components: {
    schemas: {
      LoginCredential: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Username",
          },
          email: {
            type: "string",
            description: "User's email",
          },
          password: {
            type: "string",
            description: "User's hashed password",
          },
        },
        required: ["name", "email", "password"],
      },
      Blog: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Blog post title",
          },
          body: {
            type: "string",
            description: "Blog post body",
          },
          user: {
            type: "string", // Change from integer to string
            description: "Logged in user id",
          },
          _id: {
            type: "string", // Change from integer to string
            description: "Blog post's unique id in the database",
          },
        },
      },
      BlogPost: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Title of the blog post",
          },
          body: {
            type: "string",
            description: "Content of the blog post",
          },
        },
        required: ["title", "body"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
        },
      },
      AuthToken: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "JWT Authentication token",
          },
        },
      },
      FetchUser: {
        type: "object",
        properties: {
          _id: {
            type: "string", // Change from integer to string
            description: "Specific user id in db to make the user unique",
          },
          email: {
            type: "string",
            description: "User's email",
          },
        },
      },
    },
  },
  paths: {
    "/register": {
      post: {
        tags: ["Users"],
        summary: "Register a User",
        description: "Endpoint to register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginCredential",
              },
            },
          },
        },
        responses: {
          200: {
            description: "AuthToken returned on successful registration",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthToken",
                },
              },
            },
          },
          400: {
            description: "Email already in use",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Users"],
        summary: "Login User",
        description: "Endpoint to login into an existing user using userid",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginCredential",
              },
            },
          },
        },
        responses: {
          200: {
            description: "AuthToken returned on successful registration",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthToken",
                },
              },
            },
          },
          400: {
            description: "Wrong Credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/getuser": {
      post: {
        tags: ["Users"],
        summary: "Get User Data",
        description: "Endpoint to fetch user data from db aside from password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginCredential",
              },
            },
          },
        },
        responses: {
          200: {
            description: "AuthToken returned on successful registration",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FetchUser",
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/write": {
      post: {
        tags: ["Blog"],
        summary: "Write Blog Body",
        description: "Endpoint to use post to write data into the database",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BlogPost",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Blog Post created successfuly",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Blog",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/posts": {
      get: {
        tags: ["Blog"],
        summary: "Get all Posts of loggedin user",
        description: "Endpoint to use get method to retrieve all blogs created by loggedin user from database",
        responses: {
          200: {
            description: "Fetched all posts of logged in user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Blog",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      get: {
        tags: ["Blog"],
        summary: "Fetch specific blog",
        description: "Endpoint to use GET to fetch a specific post",
        parameters: [
          {
            name: "id",
            in: "path", 
            required: true, 
            description: "ID of the blog post to fetch",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Blog Post fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Blog",            },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/post/update/{id}": {
      put: {
        tags: ["Blog"],
        summary: "Update Specific Blog Post",
        description: "Endpoint to use put to update blog data in the database",
        parameters: [
          {
            name: "id",
            in: "path", 
            required: true, 
            description: "ID of the blog post to fetch",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BlogPost",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Blog Post updated successfuly",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Blog",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/post/delete/{id}": {
      delete: {
        tags: ["Blog"],
        summary: "Delete Specific Blog Post",
        description: "Endpoint to use delete to delete data from database",
        parameters: [
          {
            name: "id",
            in: "path", 
            required: true, 
            description: "ID of the blog post to fetch",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Blog Post Deleted successfuly",
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerJsDoc;

# API Specification

## Database Models

### Prisma Schema

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tokens          Token[]
}

model Token {
  id          Int      @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

---

### Authentication Endpoints

EP: POST /v1/auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:obj{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:obj{access:obj{token:str, expires:str}, refresh:obj{token:str, expires:str}}}
ERR: {"400":"Email already exists or invalid input", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-12T10:00:00Z","updatedAt":"2025-11-12T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-12T11:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-19T10:00:00Z"}}}

---

EP: POST /v1/auth/login
DESC: Login with email and password.
IN: body:{email:str!, password:str!}
OUT: 200:{user:obj{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:obj{access:obj{token:str, expires:str}, refresh:obj{token:str, expires:str}}}
ERR: {"401":"Invalid email or password", "400":"Invalid input", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-11-12T10:00:00Z","updatedAt":"2025-11-12T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-12T11:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-19T10:00:00Z"}}}

---

EP: POST /v1/auth/logout
DESC: Logout and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"400":"Invalid refresh token", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /v1/auth/refresh-tokens
DESC: Refresh authentication tokens.
IN: body:{refreshToken:str!}
OUT: 200:{access:obj{token:str, expires:str}, refresh:obj{token:str, expires:str}}
ERR: {"401":"Invalid or expired refresh token", "400":"Invalid input", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-12T11:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-19T10:00:00Z"}}

---

EP: POST /v1/auth/forgot-password
DESC: Send password reset email.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"404":"User not found", "400":"Invalid email", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /v1/auth/reset-password
DESC: Reset password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired reset token", "400":"Invalid password format", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/reset-password?token=resetTokenHere" -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: {}

---

EP: POST /v1/auth/send-verification-email
DESC: Send email verification link to user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: POST /v1/auth/verify-email
DESC: Verify email address using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired verification token", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/verify-email?token=verificationTokenHere"
EX_RES_204: {}

---

### User Management Endpoints

EP: POST /v1/users
DESC: Create a new user (Admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already exists or invalid input", "401":"Unauthorized", "403":"Insufficient permissions", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-12T10:00:00Z","updatedAt":"2025-11-12T10:00:00Z"}

---

EP: GET /v1/users
DESC: Get paginated list of users (Admin only).
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[obj{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/users?page=1&limit=10&sortBy=name:asc" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-11-12T10:00:00Z","updatedAt":"2025-11-12T10:00:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /v1/users/:userId
DESC: Get user by ID (Own profile or Admin).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-11-12T10:00:00Z","updatedAt":"2025-11-12T10:00:00Z"}

---

EP: PATCH /v1/users/:userId
DESC: Update user information (Own profile or Admin).
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name:str, email:str, password:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already exists or invalid input", "401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Smith"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Smith","role":"USER","isEmailVerified":true,"createdAt":"2025-11-12T10:00:00Z","updatedAt":"2025-11-12T10:15:00Z"}

---

EP: DELETE /v1/users/:userId
DESC: Delete user account (Own profile or Admin).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

### MCP (Model Context Protocol) Endpoints

EP: POST /v1/mcp
DESC: Handle MCP protocol POST requests.
IN: headers:{Authorization:str!}, body:{method:str!, params:obj}
OUT: 200:{result:obj}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/mcp -H "Authorization: Bearer mcpTokenHere" -H "Content-Type: application/json" -d '{"method":"tools/list","params":{}}'
EX_RES_200: {"result":{"tools":[{"name":"user_tool","description":"User management tool"}]}}

---

EP: GET /v1/mcp
DESC: Handle MCP protocol GET requests.
IN: headers:{Authorization:str!}, query:{method:str}
OUT: 200:{result:obj}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/mcp?method=ping" -H "Authorization: Bearer mcpTokenHere"
EX_RES_200: {"result":{"status":"pong"}}

---

EP: DELETE /v1/mcp
DESC: Handle MCP protocol DELETE requests.
IN: headers:{Authorization:str!}, body:{method:str!, params:obj}
OUT: 200:{result:obj}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/mcp -H "Authorization: Bearer mcpTokenHere" -H "Content-Type: application/json" -d '{"method":"session/end","params":{}}'
EX_RES_200: {"result":{"status":"session_ended"}}

---

## Authentication & Authorization

### JWT Token Structure
- **Access Token**: Short-lived (15 minutes), used for API authentication
- **Refresh Token**: Long-lived (7 days), used to generate new access tokens

### Role-Based Access Control
- **USER**: Can manage own profile, access user endpoints
- **ADMIN**: Full access to all endpoints, user management capabilities

### Rate Limiting
- Authentication endpoints: 20 requests per 15 minutes per IP
- General API endpoints: 100 requests per 15 minutes per user

### Security Headers
- CORS enabled for specified origins
- XSS protection enabled
- Request validation and sanitization applied
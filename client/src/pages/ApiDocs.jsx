import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Check } from 'lucide-react';

const ApiDocs = () => {
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  
  const baseUrl = "https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1";

  const endpoints = [
    {
      path: "/user/signup",
      method: "POST",
      description: "Register a new user account",
      requestBody: {
        name: "string (required) - User's full name",
        email: "string (required) - Valid email address",
        password: "string (required) - Minimum 8 characters"
      },
      responses: [
        {
          code: 201,
          status: "Success",
          data: {
            message: "User registered successfully.",
            email: "user@example.com",
            user_id: "uuid"
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["A user with this email already exists."]
          }
        },
        {
          code: 401,
          status: "Error",
          data: {
            errors: ["Invalid email format.", "Password must be at least 8 characters long."]
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Internal server error."]
          }
        }
      ]
    },
    {
      path: "/user/signin",
      method: "POST",
      description: "Authenticate user and receive JWT token",
      requestBody: {
        email: "string (required) - Registered email address",
        password: "string (required) - Account password"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "User signed in successfully.",
            token: "jwt_token",
            name: "User Name",
            email: "user@example.com",
            joined_at: "timestamp",
            user_id: "uuid"
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["invalid credentials"]
          }
        },
        {
          code: 402,
          status: "Error",
          data: {
            errors: ["This account has not been verified. Please verify your account."]
          }
        }
      ]
    },{
      path: "/car/add-car",
      method: "POST",
      description: "Add a new car",
      requestBody: {
        title: "string (required) - Car title",
        description: "string (required) - Car description (minimum 10 characters)",
        car_type: "string (required) - Type of car",
        company: "string (required) - Car company",
        variant: "string (required) - Car variant (low, mid, top)",
        dealer: "string (required) - Car dealer",
        created_by: "string (required) - User's ID",
        creator_name: "string (required) - User's name",
        creator_email: "string (required) - User's email",
      },
      responses: [
        {
          code: 201,
          status: "Success",
          data: {
            message: "Car added successfully",
            car: {
              title: "Car Title",
              description: "Car Description",
              car_type: "Car Type",
              company: "Car Company",
              variant: "Car Variant",
              dealer: "Car Dealer",
              images: ["Image URL"],
              created_by: "User ID",
            }
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["At least one image is required", "Validation failed"]
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Failed to add car", "Error uploading files"]
          }
        }
      ]
    },
    {
      path: "/car/my-cars",
      method: "GET",
      description: "Get all cars created by the authenticated user",
      requestBody: {},
      responses: [
        {
          code: 200,
          status: "Success",
          data: [
            {
              title: "Car Title",
              description: "Car Description",
              car_type: "Car Type",
              company: "Car Company",
              variant: "Car Variant",
              dealer: "Car Dealer",
              images: ["Image URL"],
              created_by: "User ID",
            }
          ]
        },
        {
          code: 403,
          status: "Error",
          data: {
            message: "No cars found"
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Error fetching cars"]
          }
        }
      ]
    },
    {
      path: "/car/:id",
      method: "GET",
      description: "Get a car by ID",
      requestBody: {},
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            title: "Car Title",
            description: "Car Description",
            car_type: "Car Type",
            company: "Car Company",
            variant: "Car Variant",
            dealer: "Car Dealer",
            images: ["Image URL"],
            created_by: "User ID",
          }
        },
        {
          code: 403,
          status: "Error",
          data: {
            message: "You are not the owner of this car"
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Error fetching car"]
          }
        }
      ]
    },
    {
      path: "/car/delete/:id",
      method: "DELETE",
      description: "Delete a car by ID",
      requestBody: {},
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "Car deleted successfully"
          }
        },
        {
          code: 403,
          status: "Error",
          data: {
            message: "Car not found"
          }
        },
        {
          code: 405,
          status: "Error",
          data: {
            message: "Access denied"
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Error deleting car"]
          }
        }
      ]
    },
    {
      path: "/car/edit-details",
      method: "PUT",
      description: "Edit car details",
      requestBody: {
        car_id: "string (required) - Car ID",
        title: "string (optional) - Car title",
        description: "string (optional) - Car description",
        tags: "array (optional) - Tags for the car"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "Car details updated successfully",
            car: {
              title: "Car Title",
              description: "Car Description",
              tags: ["Tag1", "Tag2"]
            }
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["At least one field (title, description, or tags) must be changed."]
          }
        },
        {
          code: 402,
          status: "Error",
          data: {
            errors: ["Car not found"]
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Error updating car details"]
          }
        }
      ]
    },{
      path: "/user/verify",
      method: "POST",
      description: "Request email verification OTP",
      requestBody: {
        email: "string (required) - User's email address"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "OTP sent to user's email."
          }
        },
        {
          code: 401,
          status: "Error",
          data: {
            errors: ["No user with this email exists."]
          }
        },
        {
          code: 402,
          status: "Error",
          data: {
            errors: ["User is already verified."]
          }
        }
      ]
    },
    {
      path: "/user/verify",
      method: "PUT",
      description: "Verify email using OTP",
      requestBody: {
        email: "string (required) - User's email",
        registerOtp: "string (required) - 6-digit verification OTP"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "User verified successfully.",
            token: "jwt_token",
            name: "User Name",
            joined_at: "timestamp",
            user_id: "uuid"
          }
        },
        {
          code: 401,
          status: "Error",
          data: {
            errors: ["User is already verified."]
          }
        },
        {
          code: 402,
          status: "Error",
          data: {
            errors: ["Enter a valid OTP."]
          }
        }
      ]
    },
    {
      path: "/user/profile",
      method: "GET",
      description: "Get user profile information",
      headers: {
        "Authorization": "JWT token (required)"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            user_id: "uuid",
            name: "User Name",
            email: "user@example.com"
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["No user with this id exists."]
          }
        },
        {
          code: 500,
          status: "Error",
          data: {
            errors: ["Internal server error."]
          }
        }
      ]
    },
    {
      path: "/user/edit-name",
      method: "PUT",
      description: "Update user's name",
      headers: {
        "Authorization": "JWT token (required)"
      },
      requestBody: {
        name: "string (required) - New name (minimum 4 characters)"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "User updated successfully."
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["Name should be atleast 4 characters."]
          }
        },
        {
          code: 401,
          status: "Error",
          data: {
            errors: ["token missing"]
          }
        }
      ]
    },
    {
      path: "/user/reset",
      method: "POST",
      description: "Request password reset OTP",
      requestBody: {
        email: "string (required) - Registered email address"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "OTP sent to user's email."
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["No user with this email exists.", "Email is required."]
          }
        }
      ]
    },
    {
      path: "/user/reset",
      method: "PUT",
      description: "Reset password using OTP",
      requestBody: {
        email: "string (required) - Registered email",
        resetOtp: "string (required) - 6-digit OTP received via email",
        password: "string (required) - New password"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "Password reset successfully."
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["Enter a valid OTP.", "No user with this email exists."]
          }
        },
        {
          code: 403,
          status: "Error",
          data: {
            errors: ["New password cannot be same as old password."]
          }
        }
      ]
    },
    {
      path: "/user/verifyToken",
      method: "POST",
      description: "Verify JWT token validity",
      headers: {
        "Authorization": "JWT token (required)"
      },
      responses: [
        {
          code: 200,
          status: "Success",
          data: {
            message: "Token is valid"
          }
        },
        {
          code: 400,
          status: "Error",
          data: {
            errors: ["token missing"]
          }
        }
      ]
    }
  ];

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800';
      case 'POST':
        return 'bg-green-100 text-green-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (code) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 300 && code < 400) return 'text-blue-600';
    if (code >= 400 && code < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">User API Documentation</h1>
            <p className="text-gray-300">Base URL: {baseUrl}</p>
          </div>

          {/* Endpoints */}
          <div className="divide-y divide-gray-200">
            {endpoints.map((endpoint, index) => (
              <div key={`${endpoint.path}-${endpoint.method}`} className="p-4">
                <div 
                  className="flex items-start cursor-pointer"
                  onClick={() => setExpandedEndpoint(expandedEndpoint === index ? null : index)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="mt-2 text-gray-600">{endpoint.description}</p>
                  </div>
                  {expandedEndpoint === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {expandedEndpoint === index && (
                  <div className="mt-4 pl-4 space-y-4">
                    {/* Headers */}
                    {endpoint.headers && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Headers</h3>
                        <div className="bg-gray-50 rounded p-3">
                          {Object.entries(endpoint.headers).map(([key, value]) => (
                            <div key={key} className="flex space-x-2 text-sm">
                              <span className="font-mono text-purple-600">{key}:</span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {endpoint.requestBody && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Request Body</h3>
                        <div className="bg-gray-50 rounded p-3">
                          {Object.entries(endpoint.requestBody).map(([key, value]) => (
                            <div key={key} className="flex space-x-2 text-sm">
                              <span className="font-mono text-purple-600">{key}:</span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Responses</h3>
                      <div className="space-y-3">
                        {endpoint.responses.map((response, i) => (
                          <div key={i} className="border rounded">
                            <div className={`flex items-center px-3 py-2 border-b ${response.code >= 400 ? 'bg-red-50' : 'bg-green-50'}`}>
                              <span className={`${getStatusColor(response.code)} font-mono text-sm`}>
                                {response.code}
                              </span>
                              {response.code < 400 ? (
                                <Check className="w-4 h-4 text-green-500 ml-2" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                              )}
                            </div>
                            <div className="p-3">
                              <pre className="text-sm overflow-x-auto">
                                {JSON.stringify(response.data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
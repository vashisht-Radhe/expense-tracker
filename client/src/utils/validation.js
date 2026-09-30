export const validators = {
  name: (value) => {
    if (!value.trim()) {
      return "Name is required";
    }

    return "";
  },

  username: (value) => {
    const username = value.trim();

    if (!username) {
      return "Username is required";
    }

    if (username.length < 3) {
      return "Username must be at least 3 characters";
    }

    if (username.length > 30) {
      return "Username cannot exceed 30 characters";
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }

    return "";
  },

  password: (value) => {
    if (!value) {
      return "Password is required";
    }

    return "";
  },
};

export const validateField = (name, value) => {
  return validators[name]?.(value) || "";
};

export const validateForm = (formData) => {
  const errors = {};

  Object.entries(formData).forEach(([name, value]) => {
    const error = validateField(name, value);

    if (error) {
      errors[name] = error;
    }
  });

  return errors;
};

export function isValidEmail(email) {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export function validateLoginForm(formData) {
  const errors = {};

  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateRegisterForm(formData) {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = "Name is required.";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validatePostForm(formData) {
  const errors = {};

  if (!formData.locationId) {
    errors.locationId = "Please select a business location.";
  }

  if (!formData.topic?.trim()) {
    errors.topic = "Please enter a post topic.";
  }

  if (!formData.postType) {
    errors.postType = "Please select a post type.";
  }

  if (!formData.tone) {
    errors.tone = "Please select a tone.";
  }

  if (!formData.language) {
    errors.language = "Please select a language.";
  }

  if (!formData.content?.trim()) {
    errors.content = "Please generate or enter post content.";
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

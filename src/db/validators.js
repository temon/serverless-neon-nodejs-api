const {z} = require("zod");

async function validateCreateLeadInput(input) {
  const lead = z.object({
    email: z.string().email(),
  });

  let hasError;
  let validData = {};
  let message;
  try {
    validData = lead.parse(input);
    hasError = false;
    message = '';
  } catch (error) {
    hasError = true;
    message = error.errors;
  }

  return {
      data: validData,
      hasError: hasError,
      message: message,
  }
}

module.exports = {
  validateCreateLeadInput,
}


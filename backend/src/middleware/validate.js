/**
 * Zod validation middleware factory.
 * Usage: router.post('/expenses', validate(createExpenseSchema), handler)
 *
 * Validates req.body, req.params, and req.query against the provided Zod schema.
 * On failure returns 400 with formatted field errors.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  // Replace req properties with parsed/coerced data from the schema
  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;
  if (result.data.query) req.query = result.data.query;

  next();
};

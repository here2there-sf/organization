class Util {
  message = {
    salesforce: {
      loginAttempt: 'Attempting to login.',
      loginSuccess: 'Login successful.',
      loginError: 'Invalid username, password, security token; or user locked out.',
    },
    internalServerError: 'Internal server error.',
    organization: {
      notFound: 'Organization was not found.',
    },
    metadata: {
      notFound: 'Metadata was not found.',
    },
  };

  code = {
    ok: 200,
    created: 201,
    deleted: 204,
    bad: 400,
    forbidden: 401,
    notFound: 404,
    internalServerError: 500,
  };

  constant = {
    day: 60*60*24,
    week: 60*60*24*7,
    month: 60*60*24*7*4,
  };
}

export default new Util();

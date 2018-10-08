import ErrorMessages from '../constants/errors';
import statusMessage from './status';

export function registroHoras(formData) {
  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);
    return {};
  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

export function signUp(formData) {
  const { email, password, password2, firstName, lastName } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!firstName) return reject({ message: ErrorMessages.missingFirstName });
    if (!lastName) return reject({ message: ErrorMessages.missingLastName });
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });
    if (!password2) return reject({ message: ErrorMessages.missingPassword });
    if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });

    await statusMessage(dispatch, 'loading', true);
    const user = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    fetch('https://chapievent.chapilabs.com/api/users', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(user),
    }).then(async (res) => {
      if (res.ok) {
        const loginData = {
          email,
          password,
        };
        fetch('https://chapievent.chapilabs.com/api/users/login', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: JSON.stringify(loginData)
        }).then(result => result.json())
          .then(async (result) => {
            await statusMessage(dispatch, 'loading', false);
            return resolve(dispatch({
              type: 'USER_LOGIN',
              data: {
                jwt: result.token,
                user,
              },
            }));
          }).catch(reject);
      } else {
        await statusMessage(dispatch, 'loading', false);
        throw new Error('El correo ya existe');
      }
    }).catch(reject);
  }).catch(async (err) => {
    await statusMessage(dispatch, 'loading', false);
    throw err.message;
  });
}


/**
 * Get this User's Details
 */
function getUserData(dispatch) {
  const userData = {};
  return dispatch({
    type: 'USER_DETAILS_UPDATE',
    data: userData
  });
}

export function getMemberData() {
  return () => new Promise(resolve => resolve());
}

/**
 * Login
 */
export function login(formData) {
  const { email, password } = formData;

  return dispatch => new Promise(async (resolve, reject) => {

    await statusMessage(dispatch, 'loading', true);

    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });
    // TODO: call api to login here
    await statusMessage(dispatch, 'loading', false);
    // Send Login data to Redux
    return resolve(
      dispatch({
        type: 'USER_LOGIN',
        data: {
          jwt: 'jwt',
          user: 'user',
          email: 'email'
        }
      })
    );
  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

/**
 * Reset Password
 */
export function resetPassword(formData) {
  const { email } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });

    await statusMessage(dispatch, 'loading', true);

    return {};
  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

/**
 * Update Profile
 */
export function updateProfile(formData) {
  const {
    email,
    password,
    password2,
    firstName,
    lastName,
    changeEmail,
    changePassword
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!firstName) {
      return reject({ message: ErrorMessages.missingFirstName + '2'});
    }
    if (!lastName) return reject({ message: ErrorMessages.missingLastName });
    if (changeEmail) {
      if (!email) return reject({ message: ErrorMessages.missingEmail });
    }
    if (changePassword) {
      if (!password) return reject({ message: ErrorMessages.missingPassword });
      if (!password2) return reject({ message: ErrorMessages.missingPassword });
      if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });
    }

    await statusMessage(dispatch, 'loading', true);

    return {};
  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

/**
 * Logout
 */
export function logout() {
  return dispatch => new Promise((resolve) => {
    resolve(dispatch({ type: 'USER_RESET' }));
  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

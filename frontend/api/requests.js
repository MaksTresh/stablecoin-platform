import api from '../api';

//Sign in
export function login(email, password) {
    const data = {email: email, password: password};

    return api.post(`api/authorization/login`,
    {email: email, password: password}, 
    { headers: 
        { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        } 
    });
}

//Register
export function register(userName, email, password, repeatedPassword) {
    const data = {name: userName, email: email, password: password, repeated_password: repeatedPassword};

    return api.post(`api/authorization/register`, 
    data,
    { headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        } 
    });
}

//Userinfo
export function userInfo(token) {
    return api.get(`api/authorization/me`, 
    { headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
        } 
    });
}

//Replenish
export function replenish(amount, token) {
    return api.post(`api/payment/hook`, 
    {value: amount},
    { headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
        } 
    });
}

//Get currencies
export function getCurrencies(token) {
    return api.get(`/api/wallet/`, 
    { headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
        } 
    });
}

//Get currencies
export function buyMetal(token, value, name) {
    var data = {value: value, currency: name};
    return api.post(`api/wallet/buy`, 
    data,
    { headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
        } 
    });
}

//Get currencies
export function sellMetal(token, value, name) {
    var data = {rub_amount: value, currency: name};
    return api.post(`api/wallet/sell`, 
    data,
    { headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
        } 
    });
}
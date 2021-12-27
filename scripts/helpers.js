// AJAX FUNCTIONS
const AJAX = async function (url, method, formData) {
  const fetchPro = formData
    ? fetch(url, {
        method,
        body: formData,
      })
    : fetch(url);
  const response = await fetchPro;
  return await response.json();
};

export const getJSON = async function (url, formData) {
  // requests tipo GET
  return AJAX(url, 'GET', formData);
};

export const postJSON = async function (url, formData) {
  // requests tipo POST
  return AJAX(url, 'POST', formData);
};

//FORM DATA CREATOR
export const newFormData = function (obj) {
  // para crear formDatas que se puedan enviar a PHP
  const formData = new FormData();
  Object.entries(obj).forEach((el) => formData.append(el[0], el[1]));
  return formData;
};

export const generateEmployeeId = () => {
  const length = 7; // Length of the alphanumeric characters
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Alphanumeric characters

  let employeeId = "UI";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters.charAt(randomIndex);
    employeeId += randomChar;
  }

  return employeeId;
};

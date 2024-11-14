const generateOrderNumber = (prefix: string = 'ORDER-', suffix: string = ''): string => {
    const randomNumber = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generates a random alphanumeric string
    const orderNumber = `${prefix}${randomNumber}${suffix}`; // Combine prefix, random string, and suffix

    return orderNumber;
};

export default generateOrderNumber;

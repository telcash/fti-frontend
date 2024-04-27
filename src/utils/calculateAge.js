export default function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasBirthdayOccurred = (currentDate.getMonth() > birthDate.getMonth()) ||
                                (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
    if (!hasBirthdayOccurred) {
        age -= 1;
    }
    
    return age;
}
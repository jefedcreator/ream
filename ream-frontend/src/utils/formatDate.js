export const formatDate = (epochTime) => {
    const date = new Date(epochTime * 1000);
    const dateArray = date.toString().split(" ");

    return `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}. ${dateArray[4]}`
}
const updateItemCount = (countElement, itemListElement) => {
    const itemCount = itemListElement.childElementCount;
    countElement.innerText = `(${itemCount})`;
    return itemCount;
  };
  
  export default updateItemCount;
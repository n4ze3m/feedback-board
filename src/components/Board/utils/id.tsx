function uuid4() {
  let u = "";
  let m = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let i = 0;
  let rb = Math.random() * 0xffffffff | 0;
  while (i++ < 36) {
    let c = m[i - 1];
    let r = rb & 0xf;
    let v = c === "x" ? r : (r & 0x3 | 0x8);
    u += (c === "-" || c === "4") ? c : v.toString(16);
    rb = i % 8 === 0 ? Math.random() * 0xffffffff | 0 : rb >> 4;
  }
  return u;
}

export const getUserId = () => {
  // get local storage
  const userId = localStorage.getItem("userId");
  // if local storage is empty
  if (!userId) {
    // generate random uuid
    const newUserId = uuid4();
    // set local storage
    localStorage.setItem("userId", newUserId);
    // return new uuid
    return newUserId;
  }
  // return local storage
  return userId;
};

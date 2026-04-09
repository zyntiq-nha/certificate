const url = "https://zyntiq-cert.vercel.app/api/admin/login";
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@zyntiq.com", password: "Admin@12345" })
})
.then(async res => {
  console.log("Status:", res.status);
  console.log("Headers:", Object.fromEntries(res.headers.entries()));
  console.log("Body:", await res.text());
})
.catch(console.error);

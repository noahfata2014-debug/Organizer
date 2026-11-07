// Runs on Vercel. Emails the site owner whenever someone creates an account.
const OWNER = "file.organizer123@gmail.com";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ok = s => typeof s === "string" && s.length > 0 && s.length < 200;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email } = req.body || {};
  if (!ok(name) || !ok(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "bad input" });
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "File Organizer <onboarding@resend.dev>",
      to: [OWNER],
      subject: "New File Organizer account",
      html: `<p>A new account was created.</p><p>Name: ${esc(name)}<br>Email: ${esc(email)}</p>`
    })
  });
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
};

export default function FeedNewsletter() {
  return (
    <div className="bg-[#1f2326] text-white p-5">
      <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight tracking-wide mb-2">
        Sign up to see the future, today
      </h3>
      <p className="font-[family-name:var(--font-owners-text)] text-gray-300 text-xs leading-relaxed mb-4">
        Can't-miss innovations from the bleeding edge of science and tech
      </p>

      <div className="space-y-3 mb-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-9 px-3 bg-white text-black text-xs border border-gray-300 focus:outline-none rounded-none"
        />
        <button className="w-full h-9 bg-white text-black font-[family-name:var(--font-scale)] font-bold uppercase tracking-widest text-xs border border-white hover:bg-gray-200 transition rounded-none">
          Sign Up
        </button>
      </div>

      <p className="font-[family-name:var(--font-owners-text)] text-[10px] text-gray-400">
        <a href="#" className="underline hover:text-white">Terms of Service</a>
        {" & "}
        <a href="#" className="underline hover:text-white">Privacy Policy</a>
      </p>
    </div>
  );
}
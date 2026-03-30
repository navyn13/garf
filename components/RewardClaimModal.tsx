"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface RewardClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRank: number;
}

export default function RewardClaimModal({ isOpen, onClose, userRank }: RewardClaimModalProps) {
  const { publicKey } = useWallet();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/claim-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: publicKey?.toBase58(),
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          rank: userRank,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({ name: "", address: "", phone: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit claim:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-garfield-orange">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Claim Your Reward! 🎉
        </h2>
        <p className="text-gray-300 mb-6">
          Congrats! You&apos;re in the Top 50 (Rank #{userRank}). Fill out the form to claim your merch.
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-xl text-green-500 font-bold">Claim Submitted!</p>
            <p className="text-gray-400 mt-2">We&apos;ll contact you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-garfield-orange focus:outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Shipping Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-garfield-orange focus:outline-none"
                placeholder="Full shipping address"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-garfield-orange focus:outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-garfield-yellow to-garfield-orange text-black font-bold rounded-lg hover:scale-105 transition-transform"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Claim Reward"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

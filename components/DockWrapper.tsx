"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Dock from "@/components/Dock";
import AddProblemModal from "@/components/problems/AddProblemModal";
import { House, Play, Plus, Archive, User } from "@phosphor-icons/react";
import type { Problem } from "@/prisma/generated/client/client";

export default function DockWrapper() {
    const pathname = usePathname();
    const router = useRouter();
    const [reviewCount, setReviewCount] = useState<number>(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 1. Hide on landing page and login page
    const isPublicPage = pathname === "/" || pathname === "/login";

    // 2. Fetch reviews ONCE on mount (not on every route push!)
    useEffect(() => {
        if (isPublicPage) return;
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/problems/reviews");
                if (res.ok) setReviewCount(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        fetchReviews();
    }, [isPublicPage]);

    if (isPublicPage) return null;

    const iconSize = isMobile ? 18 : 20;

    return (
        <>
            <Dock
                items={[
                    { icon: <House size={iconSize} />, label: "Home", onClick: () => router.push("/dashboard") },
                    {
                        icon: (
                            <div className="relative flex items-center justify-center">
                                <Play size={iconSize} />
                                {reviewCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                                        {reviewCount}
                                    </span>
                                )}
                            </div>
                        ),
                        label: reviewCount > 0 ? `Review (${reviewCount} due)` : "Start Review",
                        onClick: () => router.push("/review"),
                    },
                    { icon: <Plus size={iconSize} />, label: "Add Problem", onClick: () => setIsAddModalOpen(true) },
                    { icon: <Archive size={iconSize} />, label: "Progress Archive", onClick: () => router.push("/problems") },
                    { icon: <User size={iconSize} />, label: "Profile", onClick: () => router.push("/profile") },
                ]}
                panelHeight={isMobile ? 56 : 68}
                baseItemSize={isMobile ? 40 : 48}
                magnification={isMobile ? 46 : 68}
                distance={isMobile ? 100 : 200}
            />

            <AddProblemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    // Re-check review count and refresh active server components
                    fetch("/api/problems/reviews")
                        .then((r) => r.json())
                        .then((count) => setReviewCount(count))
                        .catch(console.error);
                }}
            />
        </>
    );
}

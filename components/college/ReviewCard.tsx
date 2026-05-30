"use client";

import { format } from "date-fns";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type ReviewItem = {
  id: string;
  title: string;
  body: string;
  pros: string | null;
  cons: string | null;
  rating: number;
  batch: number | null;
  isVerified: boolean;
  createdAt: string;
  userName: string | null;
};

const buildStars = (rating: number) =>
  Array.from({ length: 5 }, (_, index) => index < rating);

export default function ReviewCard({ review }: { review: ReviewItem }) {
  const stars = buildStars(review.rating);
  const created = format(new Date(review.createdAt), "MMM d, yyyy");

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {stars.map((filled, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                }`}
              />
            ))}
            <span className="text-xs text-slate-500">{review.rating}/5</span>
          </div>
          {review.isVerified && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
              Verified
            </Badge>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{review.title}</h3>
          <p className="text-xs text-slate-500">
            {review.userName ?? "Anonymous"}
            {review.batch ? ` • Batch ${review.batch}` : ""} • {created}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-700">
        <p>{review.body}</p>
        {review.pros && (
          <p>
            <span className="font-semibold text-slate-900">Pros:</span> {review.pros}
          </p>
        )}
        {review.cons && (
          <p>
            <span className="font-semibold text-slate-900">Cons:</span> {review.cons}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

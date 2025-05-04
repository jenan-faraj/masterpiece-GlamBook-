// FavoritesTab.jsx
import React from "react";

const FavoritesTab = ({ favorites }) => {
  return (
    <div className="text-center py-6 min-h-[300px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">قائمتك المفضلة</h2>
      {favorites?.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {favorites.map((fav, index) => (
            <li
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-md text-right"
            >
              {typeof fav === "string" ? fav : JSON.stringify(fav)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">لا توجد عناصر في قائمتك المفضلة بعد.</p>
      )}
    </div>
  );
};

export default FavoritesTab;

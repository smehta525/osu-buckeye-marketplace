using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddUserSecrets<Program>(optional: true);

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT signing key is missing. Store it in User Secrets.");
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<BuckeyeMarketplaceContext>(options =>
    options.UseSqlite("Data Source=marketplace.db"));
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BuckeyeMarketplaceContext>();
    context.Database.Migrate();

    // Seed products
    if (!context.Products.Any())
    {
        context.Products.AddRange(
            new Product { Id = 1, Title = "Heels", Description = "Good condition. Barely used. Size 7.", Price = 15.00m, Category = "Clothing", SellerName = "Rakhi M.", PostedDate = "2026-03-01", ImageUrl = "https://picsum.photos/id/21/600/400" },
            new Product { Id = 2, Title = "Calculator", Description = "Perfect condition. Good for simple math.", Price = 25.99m, Category = "Electronics", SellerName = "Ava P.", PostedDate = "2026-03-01", ImageUrl = "https://images.unsplash.com/photo-1711344397160-b23d5deaa012?w=600" },
            new Product { Id = 3, Title = "MacBook Air", Description = "Runs great, battery health ~90%. Includes charger.", Price = 479.99m, Category = "Electronics", SellerName = "Jordan S.", PostedDate = "2026-02-27", ImageUrl = "https://picsum.photos/id/1/600/400" },
            new Product { Id = 4, Title = "Dorm Mini Fridge", Description = "Clean, works perfectly. Pickup near campus.", Price = 60.99m, Category = "Appliances", SellerName = "Mia R.", PostedDate = "2026-02-28", ImageUrl = "https://images.unsplash.com/photo-1759772238095-d1ed3f036ad5?w=600" },
            new Product { Id = 5, Title = "Graphic Hoodie", Description = "Nice design. Worn a few times. Size M.", Price = 22.99m, Category = "Clothing", SellerName = "Sam K.", PostedDate = "2026-03-02", ImageUrl = "https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=600" },
            new Product { Id = 6, Title = "Desk Lamp", Description = "LED lamp, adjustable brightness. USB powered.", Price = 35.00m, Category = "Furniture", SellerName = "Lena T.", PostedDate = "2026-03-03", ImageUrl = "https://images.unsplash.com/photo-1621447980929-6638614633c8?w=600" },
            new Product { Id = 7, Title = "Shelf", Description = "Standalone shelf, good for books or decor. Some scratches.", Price = 25.00m, Category = "Furniture", SellerName = "Noah B.", PostedDate = "2026-02-25", ImageUrl = "https://plus.unsplash.com/premium_photo-1768597134173-228f8dc20392?w=600" },
            new Product { Id = 8, Title = "iPad", Description = "Great for notes. Includes case, no scratches.", Price = 210.00m, Category = "Electronics", SellerName = "Priya D.", PostedDate = "2026-03-01", ImageUrl = "https://images.unsplash.com/photo-1661340272675-f6829791246e?w=600" },
            new Product { Id = 9, Title = "Coffee Table", Description = "Solid wood. Some minor wear but sturdy.", Price = 40.99m, Category = "Furniture", SellerName = "Chris W.", PostedDate = "2026-02-26", ImageUrl = "https://images.unsplash.com/photo-1738682767952-f85017e1a682?w=600" }
        );
        context.SaveChanges();
    }

    // Seed admin user
    if (!context.Users.Any(u => u.Role == "Admin"))
    {
        var hasher = new PasswordHasher<User>();
        var admin = new User
        {
            Email = "admin@buckeyemarketplace.com",
            Name = "Admin",
            Role = "Admin"
        };
        admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");
        context.Users.Add(admin);
        context.SaveChanges();

        // Create cart for admin
        context.Carts.Add(new Cart { UserId = admin.Id.ToString() });
        context.SaveChanges();
    }
}

app.Run();

public partial class Program { }
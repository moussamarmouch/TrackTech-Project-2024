# Use the official .NET Core SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the project files to the container
COPY . .

RUN dotnet dev-certs https

# Build the application
RUN dotnet publish -c Release -o out

RUN ls -al /root
RUN ls -al 
RUN ls -al /
RUN ls -al /root/.dotnet
RUN ls -al /app/out 
# Use the official .NET Core runtime image for the final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Set the working directory in the container
WORKDIR /app


# Copy the published output from the build image
COPY --from=build /app/out ./

RUN ls -al 

# Copy the generated certificate from the certgen image
# COPY --from=build /root/.aspnet/https ./.aspnet/https
COPY --from=build /root/.dotnet/corefx/cryptography/x509stores/my/* /root/.dotnet/corefx/cryptography/x509stores/my/

# Expose the port your application will run on
EXPOSE 6587

# Define the entry point for the container
ENTRYPOINT ["dotnet", "AnomalyTrackerBackend.API.dll"]

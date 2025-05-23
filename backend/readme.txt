0. To create image
docker run --detach --name mariadb --env MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=1 -p 3306:3306 mariadb:latest

1. In order to migrate db do the following step in your praca-dyplomowa-plan\backend folder:
dotnet tool install --global dotnet-ef
dotnet ef database update --project WebSchedule.Infrastructure --startup-project WebSchedule

2. After that in order to update to current db version you need to run:
dotnet ef database update --project WebSchedule.Infrastructure --startup-project WebSchedule

3. In order to add new migration use:
dotnet ef migrations add "Init" --project WebSchedule.Infrastructure --startup-project WebSchedule

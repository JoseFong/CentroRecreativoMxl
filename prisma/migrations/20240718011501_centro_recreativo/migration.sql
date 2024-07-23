-- CreateTable
CREATE TABLE "Docente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "aPaterno" TEXT NOT NULL,
    "aMaterno" TEXT,
    "telefono" TEXT NOT NULL,
    "fechaNac" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "aPaterno" TEXT NOT NULL,
    "aMaterno" TEXT,
    "genero" TEXT NOT NULL,
    "fechaNac" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "telefonoAlumno" TEXT,
    "direccion" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "grupoId" INTEGER,
    CONSTRAINT "Alumno_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Neurodivergencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AlumnoNEE" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumnoId" INTEGER NOT NULL,
    "neurodivergenciaId" INTEGER NOT NULL,
    CONSTRAINT "AlumnoNEE_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlumnoNEE_neurodivergenciaId_fkey" FOREIGN KEY ("neurodivergenciaId") REFERENCES "Neurodivergencia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "docenteId" INTEGER,
    CONSTRAINT "Grupo_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GrupoActividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "horario" TEXT NOT NULL,
    "grupoId" INTEGER NOT NULL,
    "actividadId" INTEGER NOT NULL,
    CONSTRAINT "GrupoActividad_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GrupoActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Salida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,
    "horaDeSalida" TEXT NOT NULL,
    CONSTRAINT "Salida_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Salida_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" REAL NOT NULL,
    "folio" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,
    "alumnoId" INTEGER NOT NULL,
    "mes" TEXT,
    "materiales" TEXT,
    CONSTRAINT "Pago_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" REAL NOT NULL,
    "concepto" TEXT NOT NULL,
    "fecha" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Docente_curp_key" ON "Docente"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_usuario_key" ON "Docente"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_curp_key" ON "Alumno"("curp");
